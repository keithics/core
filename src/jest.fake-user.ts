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
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjYxYTkxNDNmZjZkOWQyMDAwZGMzYmNlYiIsImVtYWlsIjoia2VpdGgubHVtYW5vZ0B1bml0ZWRpbnRlZ3JhbC5jb20iLCJsZXZlbCI6InVzZXIiLCJyb2xlcyI6WyIqIl19LCJpYXQiOjE2NDM5NTczOTh9.38RGidd0lqoNCllUnswlZD50jSczdrrTltmph8IlMkA';
async function createFakeUser(isAdmin: boolean = true) {
  return {
    token: isAdmin ? adminToken : userToken,
    body: { _id: '0'.repeat(24), email: 'BRSjwDfhErq3me@domain.com', level: 'user', roles: ['*'] },
    password: 'Test123!!',
  };
}

export default createFakeUser;
