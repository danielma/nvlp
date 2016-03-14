defmodule Nvlp.Router do
  import Nvlp.Plugs.Authenticated
  use Nvlp.Web, :router

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

  scope "/api", Nvlp do
    pipe_through :api

    resources "/accounts", AccountController, except: [:new, :edit]
    resources "/envelopes", EnvelopeController, except: [:new, :edit]
    resources "/transactions", TransactionController, except: [:new, :edit]
  end

  scope "/", Nvlp do
    pipe_through :browser # Use the default browser stack

    get "/login", SessionController, :new
    post "/login", SessionController, :create
  end

  scope "/", Nvlp do
    pipe_through :browser
    pipe_through :browser_auth

    get "/*anything", PageController, :index
  end
end
