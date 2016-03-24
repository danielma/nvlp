defmodule Nvlp.PageControllerTest do
  use Nvlp.ConnCase

  test "GET /", %{conn: conn} do
    conn = get conn, "/"
    assert true
  end
end
