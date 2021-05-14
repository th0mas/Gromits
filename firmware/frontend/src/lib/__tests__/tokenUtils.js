import {decodeToken, hasRole, clientId} from "../tokenUtils"

describe("Token Utilities", () => {
        const token="eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJncm9taXRfMmJwbWsiLCJhdXRoIjpbIlJPTEVfQ09OTkVDVCJdLCJpYXQiOjE2MjA5Nzk1MDcsImV4cCI6MTY1MjUxNTUwN30.XRVkvdmcCjzmPBPitZ0n1HwvyAWTXdEcIxgk_ilMLaQ"
    it("decodes tokens", () => {
        const expected = {
            sub: 'gromit_2bpmk',
            auth: [ 'ROLE_CONNECT' ],
            iat: 1620979507,
            exp: 1652515507
        } 
        expect(decodeToken(token)).toStrictEqual(expected)
    })

    it("Correctly finds the role in the token", () => {
        expect(hasRole(token, 'ROLE_CONNECT'))
    })

    it("Correctly returns false when role not found", () => {
        expect(!hasRole(token, 'admin'))
    })
})
