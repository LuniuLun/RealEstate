package apidemo.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import apidemo.models.ImageClassificationResult;
import apidemo.services.AwsS3FileService;
import apidemo.services.NSFWImageClassifierService;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/images")
public class ImageController {

  private final NSFWImageClassifierService nsfwImageClassifier;
  private final AwsS3FileService storageService;

  public ImageController(AwsS3FileService storageService, NSFWImageClassifierService nsfwImageClassifier) {
    this.nsfwImageClassifier = nsfwImageClassifier;
    this.storageService = storageService;
  }

  @PostMapping("/upload")
  public ResponseEntity<?> uploadMultipleImages(@RequestParam("file") MultipartFile[] files) {
    try {
      if (files.length == 0) {
        Map<String, Object> error = new HashMap<>();
        error.put("message", "Please select at least one file to upload");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
      }

      List<String> uploadedUrls = new ArrayList<>();

      for (MultipartFile file : files) {
        if (!file.isEmpty()) {
          String imageUrl = storageService.storeFile(file);
          uploadedUrls.add(imageUrl);
        }
      }

      Map<String, Object> response = new HashMap<>();
      response.put("urls", uploadedUrls);
      response.put("count", uploadedUrls.size());

      return ResponseEntity.ok(response);
    } catch (IllegalArgumentException e) {
      Map<String, Object> error = new HashMap<>();
      error.put("message", e.getMessage());
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    } catch (Exception e) {
      Map<String, Object> error = new HashMap<>();
      error.put("message", "Failed to upload images: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
  }

  @DeleteMapping("/delete")
  public ResponseEntity<?> deleteAllImages() {
    try {
      storageService.deleteAllFiles();
      return ResponseEntity.ok("All files deleted successfully");
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("Failed to delete files: " + e.getMessage());
    }
  }

  @PostMapping("/nsfw-check")
  public ResponseEntity<?> checkImage(@RequestParam("image") MultipartFile[] image) {
    try {
      List<ImageClassificationResult> result = nsfwImageClassifier.classify(image);
      return ResponseEntity.ok(result);
    } catch (Exception e) {
      Map<String, Object> errorResponse = new HashMap<>();
      errorResponse.put("message", "Error processing image: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }
  }
}