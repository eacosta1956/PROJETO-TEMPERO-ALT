import * as SQLite from "expo-sqlite"

function abreConexao() {
  const database = SQLite.openDatabase("ControleEstoque2.db")
  return database
}

export const db = abreConexao()
