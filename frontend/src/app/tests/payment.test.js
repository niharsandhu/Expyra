import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import HomePage from "@/app/page"; // adjust to your file path

// 🧱 Mock fetch globally (for both create-order and verify-payment)
global.fetch = jest.fn();

// 🧱 Mock alert
window.alert = jest.fn();

// 🧱 Mock Razorpay constructor
beforeAll(() => {
  global.Razorpay = jest.fn().mockImplementation((options) => ({
    open: () => {
      // Simulate Razorpay invoking handler on success
      options.handler({
        razorpay_order_id: "order_123",
        razorpay_payment_id: "pay_123",
        razorpay_signature: "sig_123",
      });
    },
  }));
});

describe("handlePayment flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    localStorage.setItem("user", JSON.stringify({ id: "u1", name: "Nihar", email: "nihar@example.com" }));
  });

  test("successfully completes payment flow", async () => {
    // Mock /create-order response
    fetch
      .mockResolvedValueOnce({
        json: async () => ({ success: true, order: { id: "order_123", amount: 9900, currency: "INR" } }),
      })
      // Mock /verify-payment response
      .mockResolvedValueOnce({
        json: async () => ({ success: true }),
      });

    render(<HomePage />);

    const button = screen.getByRole("button", { name: /start free trial/i });
    fireEvent.click(button);

    await waitFor(() => expect(window.alert).toHaveBeenCalledWith("✅ Payment verified successfully!"));
    expect(localStorage.getItem("isPremium")).toBe("true");
  });

  test("handles payment verification failure", async () => {
    fetch
      .mockResolvedValueOnce({
        json: async () => ({ success: true, order: { id: "order_123", amount: 9900, currency: "INR" } }),
      })
      .mockResolvedValueOnce({
        json: async () => ({ success: false }),
      });

    render(<HomePage />);

    const button = screen.getByRole("button", { name: /start free trial/i });
    fireEvent.click(button);

    await waitFor(() => expect(window.alert).toHaveBeenCalledWith("❌ Payment verification failed."));
  });

  test("handles order creation failure", async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({ success: false }),
    });

    render(<HomePage />);

    const button = screen.getByRole("button", { name: /start free trial/i });
    fireEvent.click(button);

    await waitFor(() => expect(window.alert).toHaveBeenCalledWith("Payment failed, please try again."));
  });
});
