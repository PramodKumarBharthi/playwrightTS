/**
 * Test Data organized by pages/features
 * Contains only test data: inputs, expected messages, and assertions
 * Selectors and element interactions stay in page classes
 */

export const testData = {
  // ============================================
  // LOGIN PAGE TEST DATA
  // ============================================
  login: {
    validCredentials: {
      username: 'Admin',
      password: 'admin123',
    },
    invalidCredentials: {
      username: 'invaliduser@test.com',
      password: 'wrongpassword',
    },
    emptyFields: {
      username: '',
      password: '',
    },
    messages: {
      success: 'Dashboard',
      error: 'Invalid username or password',
      required: 'Login required',
      invalidFormat: 'Please enter valid credentials',
    },
  },

  // ============================================
  // DASHBOARD PAGE TEST DATA
  // ============================================
  dashboard: {
    expectedElements: {
      title: 'Dashboard',
      welcomeMessage: 'Welcome',
      logoutButton: 'Logout',
    },
    messages: {
      loadSuccess: 'Dashboard loaded successfully',
      loadError: 'Failed to load dashboard',
    },
  },

  // ============================================
  // USER MANAGEMENT PAGE TEST DATA
  // ============================================
  userManagement: {
    newUser: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1-555-0123',
      address: '123 Main St, City, State',
    },
    messages: {
      userCreated: 'User created successfully',
      userUpdated: 'User updated successfully',
      userDeleted: 'User deleted successfully',
      duplicate: 'User already exists',
    },
  },

  // ============================================
  // VALIDATION MESSAGES (Global)
  // ============================================
  validation: {
    requiredField: 'This field is required',
    invalidEmail: 'Please enter a valid email',
    passwordTooShort: 'Password must be at least 8 characters',
    phoneInvalid: 'Please enter a valid phone number',
  },

  // ============================================
  // API TEST DATA
  // ============================================
  api: {
    createUser: {
      payload: {
        name: 'Test User',
        email: 'test@example.com',
        role: 'admin',
      },
      expectedStatus: 201,
      expectedResponse: {
        success: true,
        message: 'User created',
      },
    },
    updateUser: {
      payload: {
        name: 'Updated User',
        email: 'updated@example.com',
      },
      expectedStatus: 200,
    },
    deleteUser: {
      expectedStatus: 204,
    },
  },
};
