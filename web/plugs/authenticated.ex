defmodule Envelope.Plugs.Authenticated do
  require Logger
  import Plug.Conn
  import Phoenix.Controller

  def init(default), do: default

  def call(conn, _default) do
    current_user = get_session(conn, :current_user)

    if current_user do
      assign(conn, :current_user, current_user)
    else
      conn
      |> put_flash(:error, "You must be logged in")
      |> redirect(to: Envelope.Router.Helpers.session_path(conn, :new))
    end
  end
end
