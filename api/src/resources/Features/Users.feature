@api
Feature: Users REST API Validation

  @smoke @regression
  Scenario Outline: Validate Users API Operations for "<scenarioName>" Scenario
    When User sends "<method>" request to "<url>" with headers "<headers>" and query file "<queryFile>" and body file "<bodyFile>"
    Then User verifies the response status code is <statusCode>
    And User verifies the response body matches JSON schema "<schemaFile>"
    Then User verifies fields in response: "<fields>" with content type "<contentType>"

    Examples:
      | scenarioName           | method | url        | headers | queryFile              | bodyFile          | statusCode | schemaFile     | contentType | fields        |
      | Get Single User        | GET    | /users/1   | NA      | NA                     | NA                | 200        | userSchema     | json        | Leanne Graham |
      | Get All Users          | GET    | /users     | NA      | NA                     | NA                | 200        | userListSchema | NA          | NA            |
      | Get User Params        | GET    | /users     | NA      | userQueryParams        | NA                | 200        | NA             | NA          | NA            |
      | Filter User by Username| GET    | /users     | NA      | userFilterQueryParams  | NA                | 200        | NA             | json        | Bret          |
      | Get Invalid User       | GET    | /users/999 | NA      | NA                     | NA                | 404        | NA             | NA          | NA            |
      | Create New User        | POST   | /users     | NA      | NA                     | createUserPayload | 201        | userSchema     | NA          | NA            |
      | Update User Details    | PUT    | /users/1   | NA      | NA                     | updateUserPayload | 200        | userSchema     | NA          | NA            |
      | Patch User Details     | PATCH  | /users/1   | NA      | NA                     | patchUserPayload  | 200        | userSchema     | NA          | NA            |
      | Delete User            | DELETE | /users/1   | NA      | NA                     | NA                | 200        | NA             | NA          | NA            |
