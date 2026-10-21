$ErrorActionPreference = "Stop"

Write-Host "Running pre-deploy script..."

$REPOSITORY_ROOT = (Resolve-Path (Join-Path $PSScriptRoot "../..")).Path

# Load the azd environment variables
& (Join-Path $PSScriptRoot "load_azd_env.ps1")

# Verify the required environment variables
$requiredVariables = @(
    "AZURE_API_CENTER",
    "AZURE_API_CENTER_LOCATION",
    "AZURE_CLIENT_ID",
    "AZURE_TENANT_ID"
)

foreach ($name in $requiredVariables) {
    if ([string]::IsNullOrWhiteSpace(
        [Environment]::GetEnvironmentVariable($name)
    )) {
        throw "Required environment variable '$name' is missing."
    }
}

# Read the existing template from the repository root
$templatePath = Join-Path $REPOSITORY_ROOT "config.example.json"
$distPath = Join-Path $REPOSITORY_ROOT "dist"
$outputPath = Join-Path $distPath "config.json"

if (!(Test-Path $templatePath)) {
    throw "Configuration template not found: $templatePath"
}

if (!(Test-Path $distPath)) {
    throw "Build output directory not found: $distPath"
}

$config = Get-Content $templatePath -Raw | ConvertFrom-Json

# Validate the expected structure
if ($null -eq $config.authentication) {
    throw "The configuration template is missing the authentication object."
}

# Populate Azure configuration
$config.dataApiHostName = "https://$($env:AZURE_API_CENTER).data.$($env:AZURE_API_CENTER_LOCATION).azure-apicenter.ms/workspaces/default"
$config.authentication.clientId = $env:AZURE_CLIENT_ID
$config.authentication.tenantId = $env:AZURE_TENANT_ID

# Write the configuration directly to the build output
$config |
    ConvertTo-Json -Depth 100 |
    Set-Content -Path $outputPath -Encoding utf8

if (!(Test-Path $outputPath)) {
    throw "Failed to generate $outputPath"
}

Write-Host "Configuration generated successfully: $outputPath"