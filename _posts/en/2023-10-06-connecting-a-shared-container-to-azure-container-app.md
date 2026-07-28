---
layout: post
title: "Connecting a shared container to Azure Container App"
date: 2023-10-06
description: "A brief technical note outlining the basic approach and applicable steps for connecting a shared container to Azure Container App."
categories: azure
lang: en-US
translation_key: "azure-container-app-shared-file-mount-534e7c57"
permalink: /en/2023/10/06/connecting-a-shared-container-to-azure-container-app.html
---

- Create File share in Storage.
- Storage Mount settle
  - get key 
    ```sh 
      $STORAGE_ACCOUNT_KEY=$(az storage account keys list -n $STORAGE_ACCOUNT_NAME --query "[0].value" -o tsv)
    ```
  - set storage
    ```sh
      az containerapp env storage set `
        --access-mode ReadWrite `
        --azure-file-account-name $STORAGE_ACCOUNT_NAME `
        --azure-file-account-key $STORAGE_ACCOUNT_KEY `
        --azure-file-share-name $STORAGE_SHARE_NAME `
        --storage-name $STORAGE_MOUNT_NAME `
        --name $ENVIRONMENT_NAME `
        --resource-group $RESOURCE_GROUP `
        --output table
      ```
- Download container app as yaml
  ```sh
    az containerapp show `
      --name $CONTAINER_APP_NAME `
      --resource-group $RESOURCE_GROUP `
      --output yaml > app.yaml
  ```
- make updates in yaml file
  - Define volume under template
      ```yaml
        volumes:
        - name: opencart-image-mount-volume
          storageName: opencart-image-mount
          storageType: AzureFile
      ```
  - mount it in the container
    ```sh
      volumeMounts:
          - volumeName: opencart-logs-mount-volume
            mountPath: /storage/logs
    ```
- update yaml
  ```sh
    az containerapp update `
    --name $CONTAINER_APP_NAME `
    --resource-group $RESOURCE_GROUP `
    --yaml app.yaml `
    --output table
  ```
