import {decodeToken, hasRole, clientId} from "../tokenUtils"

it("decodes tokens", () => {
    const token="eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJncm9taXRfMmJwbWsiLCJhdXRoIjpbIlJPTEVfQ09OTkVDVCJdLCJpYXQiOjE2MjA5Nzk1MDcsImV4cCI6MTY1MjUxNTUwN30.XRVkvdmcCjzmPBPitZ0n1HwvyAWTXdEcIxgk_ilMLaQ"
    const expected = {
        sub: 'gromit_2bpmk',
        auth: [ 'ROLE_CONNECT' ],
        iat: 1620979507,
        exp: 1652515507
    } 
    expect(decodeToken(token)).toStrictEqual(expected)
})
