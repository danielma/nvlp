defmodule Nvlp.SessionController do
  require Logger

  use Nvlp.Web, :controller

  plug :scrub_params, "user" when action in [:create]

  def new(conn, _params) do
    if get_session(conn, :current_user) do
      redirect(conn, to: page_path(conn, :index, [""]))
    else
      render conn
    end
  end

  def create(conn, %{"user" => user_params}) do
    auth = Application.get_env(:envelope, :authentication)
    if user_params["username"] == auth[:username] &&
      user_params["password"] == auth[:password] do
      conn
      |> put_session(:current_user, true)
      |> put_flash(:info, "You are signed in!")
      |> redirect(to: "/")
    else
      conn
      |> delete_session(:current_user)
      |> put_flash(:info, "Wrong username or password")
      |> render("new.html")
    end
  end
end
