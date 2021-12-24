port module Main exposing (..)
-- import PlyLnd
import Browser
import Html exposing (Html, button, div, text)
import Html.Events exposing (onClick)
import Html.Events exposing (..)
import Json.Decode
import Types
import Interop
import InteropDefinitions as InteropDef

main : Program () Model Msg
main = Browser.element 
  { init = init
  , update = update
  , view = view
  , subscriptions = subscriptions }

type alias Model = 
  { source : String
  , context : List String
  }

type alias Flags = ()

type Msg 
  = EvalExpr String
  | Source String
  | Alert String
  | InteropReceive InteropDef.ToElm
  | InteropError Json.Decode.Error



-- Initial model
-- init : Model
init : Flags -> (Model,Cmd Msg)
init _ = ({source = "", context = []},Cmd.none)

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    InteropReceive pkg -> handleInteropPackage pkg model
    EvalExpr str 
      -> ({ model | context = str :: model.context }, Interop.send (InteropDef.Display str))
    Source str -> ({ model | source = str }, Cmd.none)
    Alert s -> (model,Cmd.none)
    InteropError e -> (model,Interop.send (InteropDef.Display "Error!"))


handleInteropPackage : InteropDef.ToElm -> Model -> (Model, Cmd Msg)
handleInteropPackage pkg model = 
  case pkg of 
    InteropDef.AuthenticatedUser user -> 
      (model,Cmd.none)
    InteropDef.EvaluationRequest evalPkg -> 
      ( { model | source = evalPkg.source, context = evalPkg.expr :: model.context }
      , Interop.send (InteropDef.Display "Got it!"))
    InteropDef.EvaluationResponse str -> 
      ( model
      , Interop.send (InteropDef.Display str))

view : Model -> Html Msg
view model = div [] []
  -- div []
  --   [ button [ onClick Decrement ] [ text "-" ]
  --   , div [] [ text (String.fromInt model) ]
  --   , button [ onClick Increment ] [ text "+" ]
  --   ]

port evaluationReceiver : (String -> msg) -> Sub msg
port setSourceReceiver : (String -> msg) -> Sub msg

port evaluateExpression : String -> Cmd msg

-- port sendMessage : String -> Cmd msg
-- port messageReceiver : (String -> msg) -> Sub msg
-- subscriptions : Model -> Sub Msg
-- subscriptions _ 
--   = Sub.batch [ evaluationReceiver EvalExpr
--               , setSourceReceiver Source
--               ]

portActionToMsg : InteropDef.ToElm -> Msg
portActionToMsg = InteropReceive


subscriptions : Model -> Sub Msg
subscriptions model =
  Interop.toElm
    |> Sub.map (\rec -> 
      case rec of 
        Ok value  -> portActionToMsg value
        Err error -> InteropError error
      )


