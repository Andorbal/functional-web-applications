defmodule IslandsEngine.GameTest do
  use ExUnit.Case

  alias IslandsEngine.{Game, Rules}

  describe "guess " do
    setup [:start_game]

    test "cannot guess in initialized state", %{game: game} do
      assert :error = Game.guess_coordinate(game, :player1, 1, 1)
    end
  end

  describe "guesses in valid state" do
    setup [:start_game, :ready_for_guesses]

    test "guesses wrong coordinate", %{game: game} do
      assert {:miss, :none, :no_win} = Game.guess_coordinate(game, :player1, 5, 5)
    end

    test "returns error if player1 guesses again", %{game: game} do
      Game.guess_coordinate(game, :player1, 5, 5)
      assert :error = Game.guess_coordinate(game, :player1, 3, 1)
    end

    test "returns win when guess is the last hit", %{game: game} do
      Game.guess_coordinate(game, :player1, 5, 5)
      assert {:hit, :dot, :win} = Game.guess_coordinate(game, :player2, 1, 1)
    end
  end

  defp start_game(_context) do
    {:ok, game} = Game.start_link("Miles")
    {:ok, game: game}
  end

  defp ready_for_guesses(%{game: game}) do
    Game.add_player game, "Trane"
    Game.position_island game, :player1, :dot, 1, 1
    Game.position_island game, :player2, :square, 1, 1

    state_data = :sys.get_state game
    :sys.replace_state game, fn data -> %{data | rules: %Rules{state: :player1_turn}} end
    {:ok, game: game}
  end
end
