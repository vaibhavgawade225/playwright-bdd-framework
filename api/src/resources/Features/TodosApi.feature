@api
Feature: Todos REST API Management Validation

  @regression
  Scenario Outline: Validate Todos API Operations for "<scenarioName>" Scenario
    When User sends "<method>" request to "<url>" with headers "<headers>" and query file "<queryFile>" and body file "<bodyFile>"
    Then User verifies the response status code is <statusCode>
    And User verifies the response body matches JSON schema "<schemaFile>"
    Then User verifies fields in response: "<fields>" with content type "<contentType>"

    Examples:
      | scenarioName          | method | url        | headers | queryFile       | bodyFile          | statusCode | schemaFile     | contentType | fields |
      | Get Single Todo       | GET    | /todos/1   | NA      | NA              | NA                | 200        | todoSchema     | NA          | NA     |
      | Get All Todos         | GET    | /todos     | NA      | NA              | NA                | 200        | todoListSchema | NA          | NA     |
      | Filter Completed Todos| GET    | /todos     | NA      | todoQueryParams | NA                | 200        | todoListSchema | NA          | NA     |
      | Get Invalid Todo      | GET    | /todos/9999| NA      | NA              | NA                | 404        | NA             | NA          | NA     |
      | Create New Todo       | POST   | /todos     | NA      | NA              | createTodoPayload | 201        | todoSchema     | NA          | NA     |
      | Delete Todo           | DELETE | /todos/1   | NA      | NA              | NA                | 200        | NA             | NA          | NA     |
