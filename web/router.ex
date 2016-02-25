defmodule Envelope.Router do
  import Envelope.Plugs.Authenticated
  use Envelope.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
    plug :api_authentication
  end

  pipeline :browser_auth do
    plug :browser_authentication
  end

  scope "/", Envelope do
    pipe_through :browser # Use the default browser stack

    get "/", SessionController, :new
    post "/login", SessionController, :create
  end

  scope "/app", Envelope do
    pipe_through :browser
    pipe_through :browser_auth
  end

  scope "/api", Envelope do
    pipe_through :api

    resources "/accounts", AccountController, except: [:new, :edit]
  end
end
