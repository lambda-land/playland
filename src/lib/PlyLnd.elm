module PlyLnd exposing (..)

import Browser
import Html.Events exposing (..)
import Json.Decode as D
import Json.Encode as E

type alias LineOfCode =
  { line : Int
  , code : String
  }

type alias EvalPair semDom =
  { expr : String 
  , value : semDom
  }

type alias EvalModel semDom = 
  { source : List LineOfCode
  , evalContext : List semDom
  }

type Lang sents exprs semDom = Lang 
  { sentences : sents
  , expressions : exprs
  , semDom : semDom
  }

type alias SemFunc expr semDom = expr -> semDom

type alias Repl sent expr semDom = (sent,expr) -> semDom

repl : SemFunc expr semDom -> Repl sent expr semDom
repl 


type alias ClassName record = { record | hasThis : Int }



-- preP : Lang sent expr val -> Lang sent_ expr val
-- preP f = 



type alias LangPreprocessor sent sent_ = sent -> sent_
type alias ExprPreprocessor expr expr_ = expr -> expr_
type alias ValuePostprocessor val val_ = val -> val_




-- type alias LangProcessor sent expr val sent_ expr_ val_ =
--   Lang sent expr val -> Lang sent_ expr_ val_

-- assembleProcessor : LangPreprocessor sent sent_ -> ExprPreprocessor expr expr_ -> ValuePostprocessor val val_ -> LangProcessor sent expr val sent_ expr_ val_
-- assembleProcessor preP preE postV = 




-- port evaluationReceiver : (String -> msg) -> Sub msg
-- port evaluateExpression : String -> Cmd msg
