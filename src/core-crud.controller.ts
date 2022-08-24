import globalPrefs from './global-preferences';
import { catchAsync } from '@keithics/errors/lib/catch-async';
import { arkAssert, ArkErrorNotFound, ArkErrorOther } from '@keithics/errors/lib/ark.assert';

/**
 * As much as possible don't update this class
 * It would be better to just extend it
 */
class CoreCrudController {
  // fields to show, be default will hide __v
  protected fields = { __v: false };

  // mongoose model
  protected model;

  /**
    if a mongoose model has reference to another collection, then add an item into this array
    example: posts has a reference to user
    const Post = new Schema{
      title: string;
      content: string;
      author: {
        type: Schema.Types.ObjectId, ref: 'User'
      }
    }
    populated = ['author']
   **/
  protected populated = [];

  /** maximum data per query in list **/
  protected limit = globalPrefs.paginationLimit;
  /** where clause in list **/
  protected where = { deleted: false };
  /** sort filter in list **/
  protected sort = { name: 1, createdAt: -1 };
  /** set to true if you want to sort by default **/
  protected sortFirstPaginate = false;
  /** set to true, will query all data regardless of who created it **/
  protected isAdmin = false;

  /** valid search keys list **/
  protected validFilterKeys: string[] = ['name'];
  protected validSearchFilterKeys: string[] = ['name'];

  /***
   * Count data of {@link model}
   * @param req Express Request
   * @param res Express Response
   * @return Length of {@link model}
   **/
  public async count(req, res) {
    const count = await this.model.where(this.where).count();
    res.jsonp(count);
  }

  /***
   * Get the list of {@link model}
   * @param req Express Request
   * @param res Express Response
   * @return List of {@link model}
   **/
  public list = catchAsync(async (req, res) => {
    const { page = 1, sort = { createdAt: -1 }, limit = this.limit } = req.body;
    const aSort = sort ? sort : this.sortFirstPaginate ? this.sort : { createdAt: -1 };
    const currentUser = this.isAdmin ? null : { user: req.user };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const data = await this.model.paginate({ ...this.where, ...currentUser }, { page, sort: aSort, limit, populate: this.populated });
    res.jsonp(data);
  });

  /***
   * Create {@link model}
   * @param req Express Request
   * @param res Express Response
   * @return created data {@link model}
   **/
  public create = catchAsync(async (req, res) => {
    const data = await this.model.create({ ...req.body, user: req.user });
    arkAssert(data, ArkErrorOther);
    res.jsonp(data);
  });

  /***
   * Read {@link model}
   * @param req Express Request
   * @param res Express Response
   * @return JSON data
   **/
  public read = catchAsync(async (req, res) => {
    const currentUser = this.isAdmin ? null : { user: req.user };
    const data = await this.model.findOne({ _id: req.params.id, ...currentUser }, this.fields).populate(this.populated);
    arkAssert(data, ArkErrorNotFound);
    res.jsonp(data);
  });

  /***
   * Update {@link model}
   * @param req Express Request
   * @param res Express Response
   * @return updated data
   **/
  public update = catchAsync(async (req, res) => {
    const currentUser = this.isAdmin ? null : { user: req.user };
    const data = await this.model.findOneAndUpdate(
      {
        _id: req.params.id,
        ...currentUser,
      },
      { ...req.body, ...currentUser },
      { new: true }
    );
    arkAssert(data, ArkErrorNotFound);
    res.jsonp(data);
  });

  /***
   * Delete {@link model}
   * @param req Express Request
   * @param res Express Response
   * @return Deleted data
   **/
  public delete = catchAsync(async (req, res) => {
    const currentUser = this.isAdmin ? null : { user: req.user };
    const data = await this.model.findOneAndRemove({ _id: req.params.id, ...currentUser });
    arkAssert(data, ArkErrorNotFound);
    res.jsonp(data);
  });

  private checkKeys(a1: string[], a2: string[]) {
    a1.forEach(function (a) {
      arkAssert(!a2.includes(a), ArkErrorOther, 'Invalid Keys');
    });
  }

  public filter = catchAsync(async (req, res) => {
    const { page = 1, sort = { createdAt: -1 }, limit = this.limit, filters } = req.body;
    const filtersKeys = filters.map((f) => f.key);

    this.checkKeys(this.validFilterKeys, filtersKeys);

    const aSort = sort ? sort : this.sortFirstPaginate ? this.sort : { createdAt: -1 };
    const currentUser = this.isAdmin ? null : { user: req.user };
    const filter = filters.reduce((obj, item) => Object.assign(obj, { [item.key]: item.value }), {});

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const data = await this.model.paginate(
      { ...filter, ...currentUser },
      {
        page,
        sort: aSort,
        limit,
        populate: this.populated,
      }
    );
    res.jsonp(data);
  });

  public search = catchAsync(async (req, res) => {
    const { key, value } = req.body;

    const regex = {
      [key]: {
        $regex: value,
      },
    };

    const data = await this.model
      .find({ ...regex })
      .populate(this.populated)
      .limit(globalPrefs.paginationLimit);
    res.jsonp(data);
  });

  public searchFilter = catchAsync(async (req, res) => {
    const { key, value, filters } = req.body;

    const filtersKeys = filters.map((f) => f.key);
    this.checkKeys(this.validSearchFilterKeys, filtersKeys);

    const filter = filters.reduce((obj, item) => Object.assign(obj, { [item.key]: item.value }), {});

    const currentUser = this.isAdmin ? null : { user: req.user };
    const regex = {
      [key]: {
        $regex: value,
      },
    };

    const data = await this.model
      .find({ ...regex, ...filter, user: currentUser.user._id })
      .populate(this.populated)
      .limit(globalPrefs.paginationLimit);
    res.jsonp(data);
  });
}

export default CoreCrudController;
