package apidemo.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import apidemo.models.Category;
import apidemo.repositories.CategoryRepository;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

  private final CategoryRepository categoryRepository;

  public CategoryService(CategoryRepository categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  public List<Category> getAllCategories() {
    return categoryRepository.findAll();
  }

  public Optional<Category> getCategoryById(int categoryId) {
    return categoryRepository.findById(categoryId);
  }

  public Optional<Category> getCategoryByName(String name) {
    return categoryRepository.findByName(name);
  }

  @Transactional
  public Category createCategory(Category category) {
    return categoryRepository.save(category);
  }

  @Transactional
  public Category updateCategory(int categoryId, Category categoryDetails) {
    Category category = categoryRepository.findById(categoryId)
        .orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryId));

    category.setName(categoryDetails.getName());

    return categoryRepository.save(category);
  }

  @Transactional
  public void deleteCategory(int categoryId) {
    Category category = categoryRepository.findById(categoryId)
        .orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryId));

    categoryRepository.delete(category);
  }
}