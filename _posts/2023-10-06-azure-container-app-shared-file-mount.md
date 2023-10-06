---
layout: post
title: "Azure Container App'e shared container bağlama"
categories: azure
---

- Storage ta File share oluştur.
- Storage Mount settle
  - key al 
    ```sh 
      $STORAGE_ACCOUNT_KEY=$(az storage account keys list -n $STORAGE_ACCOUNT_NAME --query "[0].value" -o tsv)
    ```
  - storage set et
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
- yaml oalrak container app indir
  ```sh
    az containerapp show `
      --name $CONTAINER_APP_NAME `
      --resource-group $RESOURCE_GROUP `
      --output yaml > app.yaml
  ```
- yaml dosyasında güncellemeleri yap
  - template altına volume tanımla
      ```yaml
        volumes:
        - name: opencart-image-mount-volume
          storageName: opencart-image-mount
          storageType: AzureFile
      ```
  - container içine mount et
    ```sh
      volumeMounts:
          - volumeName: opencart-logs-mount-volume
            mountPath: /storage/logs
    ```
- yaml update et
  ```sh
    az containerapp update `
    --name $CONTAINER_APP_NAME `
    --resource-group $RESOURCE_GROUP `
    --yaml app.yaml `
    --output table
  ```
