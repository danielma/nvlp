defmodule Nvlp.TransactionView do
  use Nvlp.Web, :view

  def render("index.json", %{transactions: transactions}) do
    %{data: render_many(transactions, Nvlp.TransactionView, "transaction.json")}
  end

  def render("show.json", %{transaction: transaction}) do
    %{data: render_one(transaction, Nvlp.TransactionView, "transaction.json")}
  end

  def render("transaction.json", %{transaction: transaction}) do
    %{id: transaction.id,
      payee: transaction.payee,
      account_id: transaction.account_id,
      designated: transaction.designated,
      posted_at: transaction.posted_at,
      institution_id: transaction.institution_id,
      amount_cents: transaction.amount_cents,
      memo: transaction.memo}
  end
end
