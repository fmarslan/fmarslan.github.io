---
layout: post
title: "Azure Container App'e shared container bağlama"
categories: azure
---

1- Storage ta File share oluştur.
2- Storage Mount settle
  a- `$STORAGE_ACCOUNT_KEY=$(az storage account keys list -n $STORAGE_ACCOUNT_NAME --query "[0].value" -o tsv)`
  b- ``sh
      az containerapp env storage set `
        --access-mode ReadWrite `
        --azure-file-account-name $STORAGE_ACCOUNT_NAME `
        --azure-file-account-key $STORAGE_ACCOUNT_KEY `
        --azure-file-share-name $STORAGE_SHARE_NAME `
        --storage-name $STORAGE_MOUNT_NAME `
        --name $ENVIRONMENT_NAME `
        --resource-group $RESOURCE_GROUP `
        --output table
      ``
3- yaml oalrak container app indir
  ``sh
    az containerapp show `
      --name $CONTAINER_APP_NAME `
      --resource-group $RESOURCE_GROUP `
      --output yaml > app.yaml
  ``
4- yaml dosyasında güncellemeleri yap
  a- template altına volume tanımla
      ``yaml
        volumes:
        - name: opencart-image-mount-volume
          storageName: opencart-image-mount
          storageType: AzureFile
        ``
  b- container içine mount et
    ``sh
      volumeMounts:
          - volumeName: opencart-logs-mount-volume
            mountPath: /storage/logs
    ``
5- yaml update et
``sh
  az containerapp update `
  --name $CONTAINER_APP_NAME `
  --resource-group $RESOURCE_GROUP `
  --yaml app.yaml `
  --output table
``
