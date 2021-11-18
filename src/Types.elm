module Types exposing (..)
import Html exposing (Html, node)

type Language = Elm | Bogl

type alias Node = ()

type alias Editor = 
  { node : Node
  , readOnly : Bool
  , language : Language
  }