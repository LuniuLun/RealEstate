package apidemo;

import com.google.api.gax.paging.Page;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.Bucket;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.io.InputStream;

@SpringBootApplication
public class SpringbootApplication {

  public static void main(String[] args) {
    SpringApplication.run(SpringbootApplication.class, args);
    initializeGoogleCloudStorage();
  }

  private static void initializeGoogleCloudStorage() {
    try (InputStream serviceAccount = SpringbootApplication.class
        .getClassLoader()
        .getResourceAsStream("serviceAccountKey.json")) {

      if (serviceAccount == null) {
        throw new IllegalStateException("Service account key file not found!");
      }

      GoogleCredentials credentials = GoogleCredentials.fromStream(serviceAccount);
      Storage storage = StorageOptions.newBuilder()
          .setCredentials(credentials)
          .setProjectId("rare-animals")
          .build()
          .getService();

      listBuckets(storage);
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  private static void listBuckets(Storage storage) {
    Page<Bucket> bucketsPage = storage.list();
    for (Bucket bucket : bucketsPage.iterateAll()) {
      System.out.println("Bucket name: " + bucket.getName());
    }
  }
}