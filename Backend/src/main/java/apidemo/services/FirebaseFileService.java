package apidemo.services;

import com.google.api.gax.paging.Page;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.*;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class FirebaseFileService {

  private Storage storage;
  private static final String BUCKET_NAME = "rare-animals.appspot.com";
  private static final String FOLDER_NAME = "RealEstate";

  @EventListener
  public void init(ApplicationReadyEvent event) {
    try {
      ClassPathResource serviceAccount = new ClassPathResource("serviceAccountKey.json");
      storage = StorageOptions.newBuilder()
          .setCredentials(GoogleCredentials.fromStream(serviceAccount.getInputStream()))
          .setProjectId("rare-animals").build().getService();
    } catch (Exception ex) {
      ex.printStackTrace();
    }
  }

  public String storeFile(MultipartFile file) {
    try {
      if (!isValidFileType(file)) {
        throw new IllegalArgumentException("Invalid file type.");
      }

      String fileName = generateFileName(file.getOriginalFilename());
      String filePath = FOLDER_NAME + "/" + fileName;

      Map<String, String> metadata = new HashMap<>();
      metadata.put("firebaseStorageDownloadTokens", fileName);

      // Create BlobInfo with folder path
      BlobId blobId = BlobId.of(BUCKET_NAME, filePath);
      BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
          .setContentType(file.getContentType())
          .setMetadata(metadata)
          .build();

      // Upload file to Google Cloud Storage
      storage.create(blobInfo, file.getBytes());

      // Get URL of uploaded file (with folder path)
      String imageUrl = "https://firebasestorage.googleapis.com/v0/b/" + BUCKET_NAME + "/o/" +
          encodeURIComponent(filePath) + "?alt=media&token=" + fileName;

      System.out.println("Uploaded Successfully. Image URL: " + imageUrl);

      return imageUrl;
    } catch (IOException e) {
      e.printStackTrace();
      throw new RuntimeException("Failed to upload file: " + e.getMessage());
    }
  }

  public List<String> storeMultiFile(MultipartFile[] files) {
    List<String> uploadedUrls = new ArrayList<>();

    if (files != null && files.length > 0) {
      for (MultipartFile file : files) {
        if (!file.isEmpty()) {
          String imageUrl = storeFile(file);
          uploadedUrls.add(imageUrl);
        }
      }
    }
    return uploadedUrls;
  }

  public List<String> updateMultiFile(String initFiles, String remainFile, MultipartFile[] files) {
    List<String> finalImagesList = storeMultiFile(files);
    // Add images to keep (if any)
    if (remainFile != null && !remainFile.isEmpty()) {
      String[] imagesToKeepArray = remainFile.split(",");
      finalImagesList.addAll(Arrays.asList(imagesToKeepArray));
    }

    List<String> existingImages = new ArrayList<>();
    if (initFiles != null && !initFiles.isEmpty()) {
      existingImages = Arrays.asList(initFiles.split(","));
    }

    // Find images to delete (images in existing but not in imagesToKeep)
    for (String existingImage : existingImages) {
      if (!finalImagesList.contains(existingImage)) {
        deleteFile(existingImage);
      }
    }

    return finalImagesList;
  }

  // Helper method to URL encode the file path
  private String encodeURIComponent(String path) {
    return path.replace("/", "%2F");
  }

  public void deleteAllFiles() {
    Page<Blob> blobs = storage.list(
        BUCKET_NAME,
        Storage.BlobListOption.prefix(FOLDER_NAME + "/"));

    for (Blob blob : blobs.iterateAll()) {
      blob.delete();
    }
  }

  public boolean deleteFile(String imageUrl) {
    try {
      // Extract the file path from the URL
      String encodedFilePath = imageUrl.substring(
          imageUrl.indexOf("/o/") + 3,
          imageUrl.indexOf("?alt=media"));

      // URL decode the file path
      String filePath = decodeURIComponent(encodedFilePath);

      // Create BlobId from bucket and file path
      BlobId blobId = BlobId.of(BUCKET_NAME, filePath);

      // Delete the file
      boolean deleted = storage.delete(blobId);

      if (deleted) {
        System.out.println("Successfully deleted image: " + filePath);
      } else {
        System.out.println("Image not found: " + filePath);
      }

      return deleted;
    } catch (Exception e) {
      e.printStackTrace();
      throw new RuntimeException("Failed to delete file: " + e.getMessage());
    }
  }

  // Helper method to URL decode the file path
  private String decodeURIComponent(String encodedPath) {
    return encodedPath.replace("%2F", "/");
  }

  private boolean isValidFileType(MultipartFile file) {
    String extension = getExtension(file.getOriginalFilename());
    return extension != null && (extension.equals("jpg") ||
        extension.equals("jpeg") ||
        extension.equals("png") ||
        extension.equals("gif") ||
        extension.equals("bmp"));
  }

  private String generateFileName(String originalFileName) {
    return UUID.randomUUID().toString() + "." + getExtension(originalFileName);
  }

  private String getExtension(String originalFileName) {
    return StringUtils.getFilenameExtension(originalFileName);
  }
}