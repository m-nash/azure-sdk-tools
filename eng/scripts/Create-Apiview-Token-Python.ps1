[CmdletBinding()]
param (
  [Parameter(Mandatory = $true)]
  [string]$SourcePath,
  [Parameter(Mandatory = $true)]
  [string]$OutPath
)

python -m pip freeze
Write-Host "Generating API review token file: $($SourcePath)"
python -m apistubgen --pkg-path $SourcePath --out-path $OutPath