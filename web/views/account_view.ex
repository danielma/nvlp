defmodule Nvlp.AccountView do
  use Nvlp.Web, :view

  def render("index.json", %{accounts: accounts}) do
    %{data: render_many(accounts, Nvlp.AccountView, "account.json")}
  end

  def render("show.json", %{account: account}) do
    %{data: render_one(account, Nvlp.AccountView, "account.json")}
  end

  def render("account.json", %{account: account}) do
    %{id: account.id,
      name: account.name}
  end
end
