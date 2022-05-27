/**
 * creates test user with default settings
 * JWT SECRET= token_test
 * import jwt from 'jsonwebtoken';
 *
 * const body = {
 *   user: { _id: '0'.repeat(24), email: 'test_user@domain.com', level: 'user' },
 * };
 *
 * const token = jwt.sign(body, 'token_test');
 * //
 * console.log(token);
 */

const adminToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCIsImVtYWlsIjoidGVzdF91c2VyQGRvbWFpbi5jb20iLCJsZXZlbCI6InN1cGVyYWRtaW4ifSwiaWF0IjoxNjQ0NDExOTAyfQ.RDhVaj2Mj6wfjkQltuaa4VCX2iS2xQJ9TmYb6Att5Ms';
const userToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCIsImVtYWlsIjoidGVzdF91c2VyQGRvbWFpbi5jb20iLCJsZXZlbCI6InVzZXIifSwiaWF0IjoxNjQ1MTI4MzY4fQ.Yzeh_CGf7-l0PZ6Ft14ApGC1WNXqITtsZj01KDFlkdI';
async function createFakeUser(isAdmin: boolean = true) {
  return {
    token: isAdmin ? adminToken : userToken,
    body: { _id: '0'.repeat(24), email: 'BRSjwDfhErq3me@domain.com', level: 'user' },
    password: 'Test123!!',
  };
}

export default createFakeUser;
