defmodule Nvlp.PageController do
  use Nvlp.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
