@api
Feature: Comments REST API Management Validation

  @regression
  Scenario Outline: Validate Comments API Operations for "<scenarioName>" Scenario
    When User sends "<method>" request to "<url>" with headers "<headers>" and query file "<queryFile>" and body file "<bodyFile>"
    Then User verifies the response status code is <statusCode>
    And User verifies the response body matches JSON schema "<schemaFile>"
    Then User verifies fields in response: "<fields>" with content type "<contentType>"

    Examples:
      | scenarioName            | method | url           | headers | queryFile               | bodyFile             | statusCode | schemaFile        | contentType | fields |
      | Get Single Comment      | GET    | /comments/1   | NA      | NA                      | NA                   | 200        | commentSchema     | NA          | NA     |
      | Get All Comments        | GET    | /comments     | NA      | NA                      | NA                   | 200        | commentListSchema | NA          | NA     |
      | Get Comments by PostId  | GET    | /comments     | NA      | postCommentsQueryParams | NA                   | 200        | commentListSchema | NA          | NA     |
      | Get Non-existent Comment| GET    | /comments/9999| NA      | NA                      | NA                   | 404        | NA                | NA          | NA     |
      | Create New Comment      | POST   | /comments     | NA      | NA                      | createCommentPayload | 201        | commentSchema     | NA          | NA     |
      | Update Comment          | PUT    | /comments/1   | NA      | NA                      | updateCommentPayload | 200        | commentSchema     | NA          | NA     |
      | Delete Comment          | DELETE | /comments/1   | NA      | NA                      | NA                   | 200        | NA                | NA          | NA     |
