defmodule Nvlp.Plugs.Authenticated do
  require Logger
  import Plug.Conn
  import Phoenix.Controller

  def api_authentication(conn, _default) do
    token = conn
      |> get_req_header("authorization")
      |> List.first

    if token == api_token do
      conn
    else
      conn
      |> put_status(403)
      |> json(%{error: "unauthenticated"})
    end
  end

  def browser_authentication(conn, _default) do
    current_user = get_session(conn, :current_user)

    if current_user || auth[:always_pass] do
      assign(conn, :current_user, current_user)
    else
      conn
      |> put_flash(:error, "You must be logged in")
      |> redirect(to: Nvlp.Router.Helpers.session_path(conn, :new))
    end
  end

  def api_token do
    if auth[:always_pass] do
      nil
    else
      "Basic " <> Base.encode64(auth[:username] <> ":" <> auth[:password])
    end
  end

  defp auth do
    Application.get_env(:nvlp, :authentication)
  end
end
