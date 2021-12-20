port module Main exposing (..)
-- import PlyLnd
import Browser
import Html exposing (Html, button, div, text)
import Html.Events exposing (onClick)
import Html.Events exposing (..)
import Types

main : Program () Model Msg
main = Browser.element 
  { init = init
  , update = update
  , view = view
  , subscriptions = subscriptions }

type alias Model = Int

type alias Flags = ()

type Msg 
  = Increment 
  | Decrement
  | EvalExpr String


-- Initial model
-- init : Model
init : Flags -> (Model,Cmd Msg)
init _ = (0,Cmd.none)

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    Increment -> (model + 1,Cmd.none)
    Decrement -> (model - 1,Cmd.none)
    EvalExpr str 
      -> (model, evaluateExpression str)


view : Model -> Html Msg
view model = div [] []
  -- div []
  --   [ button [ onClick Decrement ] [ text "-" ]
  --   , div [] [ text (String.fromInt model) ]
  --   , button [ onClick Increment ] [ text "+" ]
  --   ]

port evaluationReceiver : (String -> msg) -> Sub msg
port evaluateExpression : String -> Cmd msg

-- port sendMessage : String -> Cmd msg
-- port messageReceiver : (String -> msg) -> Sub msg
subscriptions : Model -> Sub Msg
subscriptions _ = evaluationReceiver EvalExpr