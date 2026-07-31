package com.smarttraders.backend.service.impl;

import com.smarttraders.backend.dto.request.LoginRequest;
import com.smarttraders.backend.dto.request.UpdateLocationRequest;
import com.smarttraders.backend.dto.request.UserRegisterRequest;
import com.smarttraders.backend.dto.response.LoginResponse;
import com.smarttraders.backend.dto.response.NearbyTraderResponse;
import com.smarttraders.backend.dto.response.UserResponse;
import com.smarttraders.backend.entity.User;
import com.smarttraders.backend.exception.DuplicateEmailException;
import com.smarttraders.backend.exception.InvalidCredentialsException;
import com.smarttraders.backend.exception.ResourceNotFoundException;
import com.smarttraders.backend.exception.ValidationException;
import com.smarttraders.backend.repository.UserRepository;
import com.smarttraders.backend.security.JwtUtil;
import com.smarttraders.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.smarttraders.backend.dto.request.UpdateProfileRequest;

import java.util.List;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // Email validation pattern
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$"
    );

    @Override
    public UserResponse createUser(UserRegisterRequest request) {
        // Validate input fields
        validateRegistrationRequest(request);

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException(request.getEmail());
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhoneNumber(request.getPhoneNumber());
        user.setAddress(request.getAddress());
        user.setRole(request.getRole());

        User savedUser = userRepository.save(user);
        return mapToResponse(savedUser);
    }

    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(InvalidCredentialsException::new);

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException();
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        return new LoginResponse(
                token,
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole()
        );
    }

    @Override
    public UserResponse updateLocation(UpdateLocationRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        user.setLatitude(request.getLatitude());
        user.setLongitude(request.getLongitude());

        User updatedUser = userRepository.save(user);
        return mapToResponse(updatedUser);
    }

    @Override
    public List<NearbyTraderResponse> getNearbyTraders(Double latitude, Double longitude, Double radiusKm) {
        List<Object[]> results = userRepository.findNearbyTraders(latitude, longitude, radiusKm);

        return results.stream().map(row -> new NearbyTraderResponse(
                ((Number) row[0]).longValue(),      // id
                (String) row[2],                     // full_name
                (String) row[5],                     // phone_number
                ((Number) row[7]).doubleValue(),     // latitude
                ((Number) row[8]).doubleValue(),     // longitude
                ((Number) row[row.length - 1]).doubleValue() // distance (last column)
        )).toList();
    }

    @Override
    public UserResponse getMyProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return mapToResponse(user);
    }

    @Override
    public UserResponse updateProfile(UpdateProfileRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        user.setFullName(request.getFullName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setAddress(request.getAddress());

        return mapToResponse(userRepository.save(user));
    }

    private void validateRegistrationRequest(UserRegisterRequest request) {
        if (request.getFullName() == null || request.getFullName().trim().isEmpty()) {
            throw new ValidationException("Full name is required");
        }

        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new ValidationException("Email is required");
        }

        if (!EMAIL_PATTERN.matcher(request.getEmail()).matches()) {
            throw new ValidationException("Invalid email format");
        }

        if (request.getPassword() == null || request.getPassword().length() < 6) {
            throw new ValidationException("Password must be at least 6 characters long");
        }

        if (request.getPhoneNumber() == null || request.getPhoneNumber().trim().isEmpty()) {
            throw new ValidationException("Phone number is required");
        }

        // Simple phone validation: allow digits, spaces, brackets, dashes, and plus
        String cleanedPhone = request.getPhoneNumber().replaceAll("[\\s()-]", "");
        if (!cleanedPhone.matches("^\\+?[0-9]{10,15}$")) {
            throw new ValidationException("Invalid phone number format");
        }

        if (request.getAddress() == null || request.getAddress().trim().isEmpty()) {
            throw new ValidationException("Address is required");
        }
    }

    private UserResponse mapToResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getAddress(),
                user.getRole(),
                user.getCreatedAt()
        );
    }
}