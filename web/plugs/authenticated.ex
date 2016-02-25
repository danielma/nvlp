defmodule Envelope.Plugs.Authenticated do
  require Logger
  import Plug.Conn
  import Phoenix.Controller

  def api_authentication(conn, _default) do
    token = conn
      |> get_req_header("authorization")
      |> List.first

    Logger.debug(token)
    Logger.debug(get_api_token)
    if token == get_api_token do
      conn
    else
      conn
      |> put_status(403)
      |> json(%{error: "unauthenticated"})
    end
  end

  def browser_authentication(conn, _default) do
    current_user = get_session(conn, :current_user)

    if current_user do
      assign(conn, :current_user, current_user)
    else
      conn
      |> put_flash(:error, "You must be logged in")
      |> redirect(to: Envelope.Router.Helpers.session_path(conn, :new))
    end
  end

  defp get_api_token do
    auth = Application.get_env(:envelope, :authentication)

    "Basic " <> Base.encode64(auth[:username] <> ":" <> auth[:password])
  end
end
