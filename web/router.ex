defmodule Envelope.Router do
  use Envelope.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :fetch_session
    plug :fetch_flash
    plug Envelope.Plugs.Authenticated
    plug :accepts, ["json"]
  end

  scope "/", Envelope do
    pipe_through :browser # Use the default browser stack

    get "/", SessionController, :new
    post "/login", SessionController, :create
  end

  scope "/api", Envelope do
    pipe_through :api

    resources "/accounts", AccountController, except: [:new, :edit]
  end
end
