import * as SQLite from "expo-sqlite"

function abreConexao() {
  const database = SQLite.openDatabase("ControleEstoqueTempero.db")
  return database
}

export const db = abreConexao()
