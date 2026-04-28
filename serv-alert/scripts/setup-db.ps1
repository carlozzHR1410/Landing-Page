param(
  [string]$MySqlExe = 'C:\Program Files\MySQL\MySQL Server 9.6\bin\mysql.exe',
  [string]$User = 'root',
  [string]$Host = 'localhost',
  [int]$Port = 3306
)

$scriptPath = Join-Path $PSScriptRoot '..\database\serv_alert.sql'

if (-not (Test-Path $MySqlExe)) {
  throw "No se encontro mysql.exe en: $MySqlExe"
}

if (-not (Test-Path $scriptPath)) {
  throw "No se encontro el script SQL en: $scriptPath"
}

Write-Host "Se abrira MySQL y te pedira la clave del usuario $User."
& $MySqlExe -u $User -h $Host -P $Port -p --execute="source $scriptPath"
