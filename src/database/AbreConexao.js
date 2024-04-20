import * as SQLite from "expo-sqlite"

function abreConexao() {
  const database = SQLite.openDatabase("ControleEstoque4.db")
  return database
}

export const db = abreConexao()
