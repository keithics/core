import globalPrefs from './global-preferences';
import { catchAsync } from '@keithics/errors/lib/catch-async';
import { assert, ErrorNotFound, ErrorOther } from '@keithics/errors/lib/assert';

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
    assert(data, ErrorOther);
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
    const data = await this.model.findOne({ _id: req.params.id, ...currentUser }, this.fields);
    assert(data, ErrorNotFound);
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
      { new: true, overwrite: true }
    );
    assert(data, ErrorNotFound);
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
    assert(data, ErrorNotFound);
    res.jsonp(data);
  });
}

export default CoreCrudController;
