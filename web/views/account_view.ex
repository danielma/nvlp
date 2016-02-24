defmodule Envelope.AccountView do
  use Envelope.Web, :view

  def render("index.json", %{accounts: accounts}) do
    %{data: render_many(accounts, Envelope.AccountView, "account.json")}
  end

  def render("show.json", %{account: account}) do
    %{data: render_one(account, Envelope.AccountView, "account.json")}
  end

  def render("account.json", %{account: account}) do
    %{id: account.id,
      name: account.name}
  end
end
