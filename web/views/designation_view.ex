defmodule Nvlp.DesignationView do
  use Nvlp.Web, :view

  def render("index.json", %{designations: designations}) do
    %{data: render_many(designations, Nvlp.DesignationView, "designation.json")}
  end

  def render("show.json", %{designation: designation}) do
    %{data: render_one(designation, Nvlp.DesignationView, "designation.json")}
  end

  def render("designation.json", %{designation: %Nvlp.Designation{transaction: %Nvlp.Transaction{} = transaction} = designation}) do
    %{id: designation.id,
      amount_cents: designation.amount_cents,
      envelope_id: designation.envelope_id,
      transaction: Nvlp.TransactionView.render("transaction.json", %{transaction: transaction}),
    }
  end

  def render("designation.json", %{designation: designation}) do
    %{id: designation.id,
      amount_cents: designation.amount_cents,
      envelope_id: designation.envelope_id,
      transaction_id: designation.transaction_id,
    }
  end
end
