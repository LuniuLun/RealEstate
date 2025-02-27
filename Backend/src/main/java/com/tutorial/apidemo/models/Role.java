package com.tutorial.apidemo.models;

import jakarta.persistence.*;

@Entity
@Table(name = "roles")
public class Role {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "role_id")
  private Integer id;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, unique = true, length = 20)
  private RoleName name;

  // Enum for role names
  public enum RoleName {
    CUSTOMER,
    BROKER,
    ADMIN
  }

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public RoleName getName() {
    return name;
  }

  public void setName(RoleName name) {
    this.name = name;
  }
}
