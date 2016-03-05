defmodule Nvlp.EnvelopeView do
  use Nvlp.Web, :view

  def render("index.json", %{envelopes: envelopes}) do
    %{data: render_many(envelopes, Nvlp.EnvelopeView, "envelope.json")}
  end

  def render("show.json", %{envelope: envelope}) do
    %{data: render_one(envelope, Nvlp.EnvelopeView, "envelope.json")}
  end

  def render("envelope.json", %{envelope: envelope}) do
    %{id: envelope.id,
      amount_cents: envelope.amount_cents,
      name: envelope.name}
  end
end
