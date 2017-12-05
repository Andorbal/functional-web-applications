defmodule IslandsEngine.GameSupervisorTest do
  use ExUnit.Case

  alias IslandsEngine.GameSupervisor

  setup do
    GameSupervisor
    |> Supervisor.which_children
    |> Enum.map(fn {_, child, _, _} -> Supervisor.terminate_child(GameSupervisor, child) end)

    :ok
  end

  test "Can start game" do
    {:ok, _game} = GameSupervisor.start_game("Foo")
    %{active: 1} = Supervisor.count_children(GameSupervisor)
  end

  test "Can stop game" do
    {:ok, _game} = GameSupervisor.start_game("Bar")
    assert :ok = GameSupervisor.stop_game("Bar")
    %{active: 0} = Supervisor.count_children(GameSupervisor)
  end
end
