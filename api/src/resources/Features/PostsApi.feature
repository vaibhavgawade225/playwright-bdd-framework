@api
Feature: Posts REST API Management Validation

  @smoke @regression
  Scenario Outline: Validate Posts API Operations for "<scenarioName>" Scenario
    When User sends "<method>" request to "<url>" with headers "<headers>" and query file "<queryFile>" and body file "<bodyFile>"
    Then User verifies the response status code is <statusCode>
    And User verifies the response body matches JSON schema "<schemaFile>"
    Then User verifies fields in response: "<fields>" with content type "<contentType>"

    Examples:
      | scenarioName         | method | url              | headers | queryFile                | bodyFile          | statusCode | schemaFile        | contentType | fields |
      | Get Single Post      | GET    | /posts/1         | NA      | NA                       | NA                | 200        | postSchema        | NA          | NA     |
      | Get All Posts        | GET    | /posts           | NA      | NA                       | NA                | 200        | postListSchema    | NA          | NA     |
      | Get Invalid          | GET    | /posts/99999     | NA      | NA                       | NA                | 404        | NA                | NA          | NA     |
      | Filter Posts by User | GET    | /posts           | NA      | userPostFilterQueryParams| NA                | 200        | postListSchema    | NA          | NA     |
      | Create Post          | POST   | /posts           | NA      | NA                       | createPostPayload | 201        | postSchema        | NA          | NA     |
      | Update Post          | PUT    | /posts/1         | NA      | NA                       | updatePostPayload | 200        | postSchema        | NA          | NA     |
      | Patch Post           | PATCH  | /posts/1         | NA      | NA                       | patchPostPayload  | 200        | postSchema        | NA          | NA     |
      | Delete Post          | DELETE | /posts/1         | NA      | NA                       | NA                | 200        | NA                | NA          | NA     |
      | Get Post Comments    | GET    | /posts/1/comments| NA      | NA                       | NA                | 200        | commentListSchema | NA          | NA     |
