package apidemo.services;

import apidemo.config.AwsS3Config;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class AwsS3FileService {

  @Autowired
  private S3Client s3Client;

  @Autowired
  private AwsS3Config awsS3Config;

  public String storeFile(MultipartFile file) {
    try {
      if (!isValidFileType(file)) {
        throw new IllegalArgumentException("Invalid file type.");
      }

      String fileName = generateFileName(file.getOriginalFilename());
      String filePath = awsS3Config.getFolderName() + "/" + fileName;

      // Upload file to S3
      PutObjectRequest putObjectRequest = PutObjectRequest.builder()
          .bucket(awsS3Config.getBucketName())
          .key(filePath)
          .contentType(file.getContentType())
          .contentLength(file.getSize())
          .build();

      s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));

      // Generate public URL
      String imageUrl = awsS3Config.getBaseUrl() + "/" + filePath;

      System.out.println("Uploaded Successfully. Image URL: " + imageUrl);

      return imageUrl;
    } catch (IOException e) {
      e.printStackTrace();
      throw new RuntimeException("Failed to upload file: " + e.getMessage());
    } catch (Exception e) {
      e.printStackTrace();
      throw new RuntimeException("Failed to upload file to S3: " + e.getMessage());
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
    List<String> finalImagesList = new ArrayList<>();

    List<String> existingImages = new ArrayList<>();
    if (initFiles != null && !initFiles.isEmpty()) {
      existingImages = new ArrayList<>(Arrays.asList(initFiles.split(",")));
    }

    List<String> imagesToKeep = new ArrayList<>();
    if (remainFile != null && !remainFile.isEmpty()) {
      imagesToKeep = new ArrayList<>(Arrays.asList(remainFile.split(",")));
    }

    // Delete images that are not kept
    for (String existingImage : existingImages) {
      if (!imagesToKeep.contains(existingImage)) {
        deleteFile(existingImage);
      }
    }
    finalImagesList.addAll(imagesToKeep);

    // Upload new files
    if (files != null && files.length > 0) {
      finalImagesList.addAll(storeMultiFile(files));
    }

    return finalImagesList;
  }

  public void deleteAllFiles() {
    try {
      // List all objects in the folder
      ListObjectsV2Request listObjectsRequest = ListObjectsV2Request.builder()
          .bucket(awsS3Config.getBucketName())
          .prefix(awsS3Config.getFolderName() + "/")
          .build();

      ListObjectsV2Response listObjectsResponse = s3Client.listObjectsV2(listObjectsRequest);

      // Delete all objects
      for (S3Object s3Object : listObjectsResponse.contents()) {
        DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
            .bucket(awsS3Config.getBucketName())
            .key(s3Object.key())
            .build();

        s3Client.deleteObject(deleteObjectRequest);
        System.out.println("Deleted: " + s3Object.key());
      }

      System.out.println("All files in folder '" + awsS3Config.getFolderName() + "' have been deleted.");
    } catch (Exception e) {
      e.printStackTrace();
      throw new RuntimeException("Failed to delete all files: " + e.getMessage());
    }
  }

  public boolean deleteFile(String imageUrl) {
    try {
      // Extract file path from URL
      String filePath = extractFilePathFromUrl(imageUrl);

      if (filePath == null || filePath.isEmpty()) {
        throw new IllegalArgumentException("Invalid S3 URL format: " + imageUrl);
      }

      DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
          .bucket(awsS3Config.getBucketName())
          .key(filePath)
          .build();

      s3Client.deleteObject(deleteObjectRequest);

      System.out.println("Successfully deleted image: " + filePath);
      return true;
    } catch (Exception e) {
      System.err.println("Failed to delete file: " + imageUrl);
      e.printStackTrace();
      throw new RuntimeException("Failed to delete file: " + e.getMessage());
    }
  }

  private String extractFilePathFromUrl(String imageUrl) {
    try {
      // Extract path from S3 URL
      // URL format: https://bucket-name.s3.region.amazonaws.com/folder/filename
      String baseUrl = awsS3Config.getBaseUrl();

      if (imageUrl.startsWith(baseUrl)) {
        String relativePath = imageUrl.substring(baseUrl.length());
        if (relativePath.startsWith("/")) {
          relativePath = relativePath.substring(1);
        }
        return URLDecoder.decode(relativePath, StandardCharsets.UTF_8);
      }

      return null;
    } catch (Exception e) {
      e.printStackTrace();
      return null;
    }
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

  // Method to check if file exists
  public boolean fileExists(String imageUrl) {
    try {
      String filePath = extractFilePathFromUrl(imageUrl);
      if (filePath == null) {
        return false;
      }

      HeadObjectRequest headObjectRequest = HeadObjectRequest.builder()
          .bucket(awsS3Config.getBucketName())
          .key(filePath)
          .build();

      s3Client.headObject(headObjectRequest);
      return true;
    } catch (NoSuchKeyException e) {
      return false;
    } catch (Exception e) {
      e.printStackTrace();
      return false;
    }
  }

  // Method to get file size
  public long getFileSize(String imageUrl) {
    try {
      String filePath = extractFilePathFromUrl(imageUrl);
      if (filePath == null) {
        return -1;
      }

      HeadObjectRequest headObjectRequest = HeadObjectRequest.builder()
          .bucket(awsS3Config.getBucketName())
          .key(filePath)
          .build();

      HeadObjectResponse headObjectResponse = s3Client.headObject(headObjectRequest);
      return headObjectResponse.contentLength();
    } catch (Exception e) {
      e.printStackTrace();
      return -1;
    }
  }

  // Method to list all files in folder
  public List<String> listFiles() {
    List<String> fileUrls = new ArrayList<>();
    try {
      ListObjectsV2Request listObjectsRequest = ListObjectsV2Request.builder()
          .bucket(awsS3Config.getBucketName())
          .prefix(awsS3Config.getFolderName() + "/")
          .build();

      ListObjectsV2Response listObjectsResponse = s3Client.listObjectsV2(listObjectsRequest);

      for (S3Object s3Object : listObjectsResponse.contents()) {
        String fileUrl = awsS3Config.getBaseUrl() + "/" + s3Object.key();
        fileUrls.add(fileUrl);
      }
    } catch (Exception e) {
      e.printStackTrace();
      throw new RuntimeException("Failed to list files: " + e.getMessage());
    }
    return fileUrls;
  }
}