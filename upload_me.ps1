##############################################################
#                                                            #
# FTP Uploader script to update Wordpress Plugins and Themes #
# v0.1                                                       #
#                                                            #
# Created by Attila Reterics, 2023                           #
# Contact: attila@reterics.com                               #
#                                                            #
##############################################################

function showHelp {
    Write-Host "##############################################################"
    Write-Host "#                                                            #"
    Write-Host "# FTP Uploader script to update Wordpress Plugins and Themes #"
    Write-Host "# v0.1                                                       #"
    Write-Host "#                                                            #"
    Write-Host "# Created by Attila Reterics, 2023                           #"
    Write-Host "# Contact: attila@reterics.com                               #"
    Write-Host "#                                                            #"
    Write-Host "##############################################################"
    Write-Host ""
    Write-Host "Usage: upload_me.ps1 <local_folder> <remote_folder> <user> <password>"
    Write-Host "Description: This script can help update/upload a folder content to an FTP server remotely."
    Write-Host ""
    Write-Host "Arguments:"
    Write-Host "  local_folder    : Local absolute address, for example: D:\FTP\page\"
    Write-Host "  remote_folder   : ftp://<host>/<path> format for example: ftp://reterics@ftp.nethely.hu/wp-content/"
    Write-Host "  user            : username for the FTP server"
    Write-Host "  password        : password for the FTP server"
    Write-Host ""
}

if ($args.Count -ge 2) {
    $source = $args[0]
    $destination = $args[1] # ftp://username:password@example.com/destination
    $username = $args[2];
    $password = $args[3];
} else {
    showHelp
    Exit 1
}

if (-not (Test-Path $source -PathType Container)) {
    Write-Host "Sorry the folder is not exists in $source"
    Write-Host ""
    showHelp
    Exit 2
}

if ([string]::IsNullOrEmpty($destination)) {
    Write-Host "Setting up destination is mandatory"
    Write-Host ""
    showHelp
    Exit 3
}

# Reformat your destination
if (-not $destination.EndsWith('/')) {
    $destination += '/'
}
$destination = $destination -replace '^https?://', ''
if (-not ($destination -like "ftp://*")) {
    $destination = "ftp://$destination"
}

$uri = New-Object System.Uri($destination)

function uploadToFTPServer($remote, $local)
{
    $request = [System.Net.FtpWebRequest]::Create($remote)

    if (-not [string]::IsNullOrEmpty($username) -and -not [string]::IsNullOrEmpty($password)) {
        $request.Credentials = New-Object System.Net.NetworkCredential($username, $password)
    }

    $request.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
    $request.UsePassive = $true
    $fileStream = [System.IO.File]::OpenRead($local)
    $ftpStream = $request.GetRequestStream()
    $fileStream.CopyTo($ftpStream)
    $ftpStream.Dispose()
    $fileStream.Dispose()
}

function RecursiveUpload {
    param (
        [string]$source,
        [string]$destination
    )
    $files = Get-ChildItem $source

    try {
        foreach ($file in $files)
        {
            if (-not [string]::IsNullOrWhiteSpace($file.Name)) {
                if (-not $file.PSIsContainer -and -not $file.Name.EndsWith('.ps1')) {
                    $fileName = $file.Name
                    $fileFullName = $file.FullName
                    $dest = "$destination$fileName"
                    Write-Host "Uploading file $fileName from $fileFullName to $dest"
                    uploadToFTPServer "$dest" $file.FullName
                }elseif ($file.PSIsContainer) {
                    # Recursive call for subdirectories
                    $newDestination = $destination + "\" + $file.Name + "\"
                    RecursiveUpload -source $file.FullName -destination $newDestination
                }
            } else {
                Write-Host "Invalid item name for $file"
            }
        }
    } catch {
        Write-Host "An error occurred: $_.Exception.Message"
        Write-Host "Upload failed successfully";
    }
}

RecursiveUpload -source $source -destination $destination