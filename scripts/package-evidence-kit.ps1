$ErrorActionPreference = 'Stop'

$repositoryRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$productRoot = Join-Path $repositoryRoot 'products\evidence-kit'
$artifactRoot = Join-Path $repositoryRoot 'output\product'
$artifactPath = Join-Path $artifactRoot 'twelvecheck-evidence-kit-v1.0.0.zip'

$entryNames = @(
  'START-HERE.md'
  'twelvecheck-evidence-workbook.html'
  'evidence-log.csv'
  'finding-template.md'
  'walkthrough-script.md'
  'sample-project-backup.json'
  'LICENSE.txt'
  'MANIFEST.txt'
  'VERSION.txt'
)

$entryPaths = foreach ($entryName in $entryNames) {
  $entryPath = Join-Path $productRoot $entryName
  if (-not (Test-Path -LiteralPath $entryPath -PathType Leaf)) {
    throw "Missing Evidence Kit entry: $entryName"
  }
  (Resolve-Path -LiteralPath $entryPath).Path
}

New-Item -ItemType Directory -Path $artifactRoot -Force | Out-Null
if (Test-Path -LiteralPath $artifactPath) {
  Remove-Item -LiteralPath $artifactPath -Force
}

Compress-Archive -LiteralPath $entryPaths -DestinationPath $artifactPath -CompressionLevel Optimal

Add-Type -AssemblyName System.IO.Compression.FileSystem
$archive = [System.IO.Compression.ZipFile]::OpenRead($artifactPath)
try {
  $actualNames = @($archive.Entries | ForEach-Object { $_.FullName })
  if ($actualNames.Count -ne $entryNames.Count) {
    throw "Unexpected Evidence Kit archive entry count: $($actualNames.Count)"
  }
  foreach ($entryName in $entryNames) {
    if ($actualNames -notcontains $entryName) {
      throw "Evidence Kit archive missing entry: $entryName"
    }
  }
}
finally {
  $archive.Dispose()
}

$artifact = Get-Item -LiteralPath $artifactPath
$hash = Get-FileHash -LiteralPath $artifactPath -Algorithm SHA256

[pscustomobject]@{
  Path = $artifact.FullName
  Bytes = $artifact.Length
  Entries = $entryNames.Count
  SHA256 = $hash.Hash
}
