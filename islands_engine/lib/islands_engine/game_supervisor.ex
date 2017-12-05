defmodule IslandsEngine.GameSupervisor do
  use Supervisor

  alias IslandsEngine.Game

  # Client
  def start_link(_options), do:
    Supervisor.start_link(__MODULE__, :ok, name: __MODULE__)

  def start_game(name), do:
    Supervisor.start_child(__MODULE__, [name])

  def stop_game(name), do:
    Supervisor.terminate_child(__MODULE__, pid_from_name(name))

  # Server
  def init(:ok), do:
    Supervisor.init([Game], strategy: :simple_one_for_one)

  defp pid_from_name(name) do
    name
    |> Game.via_tuple()
    |> GenServer.whereis()
  end
end