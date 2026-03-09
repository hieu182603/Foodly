import React, { useState } from "react";
import {
  ArrowLeft,
  ClipboardList,
  MapPin,
  Phone,
  CreditCard,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CartItem, User, Order } from "../types";
import { dbService } from "../databaseService";

interface CheckoutPageProps {
  cart: CartItem[];
  currentUser: User | null;
  onCheckoutSuccess?: () => void;
}

const CheckoutPage = ({ cart, currentUser, onCheckoutSuccess }: CheckoutPageProps) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState<"takeaway" | "delivery">("takeaway");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = deliveryOption === "delivery" ? 30000 : 0;
  const finalTotal = total + deliveryFee;

  const handlePlaceOrder = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    if (cart.length === 0) {
      navigate("/cart");
      return;
    }

    setIsProcessing(true);

    // Create new order
    const orderId = `#ORD-${Date.now()}`;
    const newOrder: Order = {
      id: orderId,
      customer: currentUser.name,
      table: deliveryOption === "takeaway" ? "Take away" : `Delivery - ${address || "N/A"}`,
      total: finalTotal,
      status: "Pending",
    };

    // Save order to database
    try {
      await dbService.addOrder(newOrder);
      
      // Verify order was saved
      const savedOrders = await dbService.getOrders();
      const orderExists = savedOrders.some(o => o.id === orderId);
      
      if (!orderExists) {
        console.error("Failed to save order to database");
        alert("Có lỗi xảy ra khi lưu đơn hàng. Vui lòng thử lại.");
        setIsProcessing(false);
        return;
      }
    } catch (error) {
      console.error("Failed to save order:", error);
      alert("Có lỗi xảy ra khi lưu đơn hàng. Vui lòng thử lại.");
      setIsProcessing(false);
      return;
    }

    // Clear cart
    if (onCheckoutSuccess) {
      onCheckoutSuccess();
    }

    // Show success and redirect
    setTimeout(() => {
      setIsProcessing(false);
      alert(`Đơn hàng ${orderId} đã được tạo thành công!`);
      navigate("/orders");
    }, 500);
  };

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-textSec mb-4">Vui lòng đăng nhập để tiếp tục</p>
        <button
          onClick={() => navigate("/login")}
          className="px-8 py-3 bg-primary text-white font-bold rounded-2xl hover:bg-primaryDark"
        >
          Đăng nhập
        </button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-textSec mb-4">Giỏ hàng của bạn đang trống</p>
        <button
          onClick={() => navigate("/menu")}
          className="px-8 py-3 bg-primary text-white font-bold rounded-2xl hover:bg-primaryDark"
        >
          Xem thực đơn
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate("/cart")}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-black text-textMain">Checkout</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Order Details & Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Option */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-textMain mb-4">Phương thức nhận hàng</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setDeliveryOption("takeaway")}
                className={`p-4 rounded-xl border-2 transition-all ${
                  deliveryOption === "takeaway"
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-primary/50"
                }`}
              >
                <div className="font-bold text-textMain mb-1">Mang đi</div>
                <div className="text-sm text-textSec">Tự đến lấy tại cửa hàng</div>
              </button>
              <button
                onClick={() => setDeliveryOption("delivery")}
                className={`p-4 rounded-xl border-2 transition-all ${
                  deliveryOption === "delivery"
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-primary/50"
                }`}
              >
                <div className="font-bold text-textMain mb-1">Giao hàng</div>
                <div className="text-sm text-textSec">Giao tận nơi (+30,000đ)</div>
              </button>
            </div>

            {deliveryOption === "delivery" && (
              <div className="mt-4 space-y-3">
                <div>
                  <label className="block text-sm font-bold mb-2">Địa chỉ giao hàng</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Nhập địa chỉ..."
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Số điện thoại</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Nhập số điện thoại..."
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-textMain mb-4">Phương thức thanh toán</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setPaymentMethod("cash")}
                className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                  paymentMethod === "cash"
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-primary/50"
                }`}
              >
                <CreditCard size={20} />
                <div className="text-left">
                  <div className="font-bold text-textMain">Tiền mặt</div>
                  <div className="text-sm text-textSec">Thanh toán khi nhận hàng</div>
                </div>
              </button>
              <button
                onClick={() => setPaymentMethod("card")}
                className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                  paymentMethod === "card"
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-primary/50"
                }`}
              >
                <CreditCard size={20} />
                <div className="text-left">
                  <div className="font-bold text-textMain">Thẻ</div>
                  <div className="text-sm text-textSec">Visa, Mastercard</div>
                </div>
              </button>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-textMain mb-4">Đơn hàng của bạn</h2>
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4 pb-3 border-b border-gray-100 last:border-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-textMain">{item.name}</h3>
                    <p className="text-sm text-textSec">Số lượng: {item.quantity}</p>
                  </div>
                  <div className="font-bold text-primary">
                    {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
            <h2 className="text-xl font-extrabold mb-6">Tóm tắt đơn hàng</h2>

            <div className="space-y-3 border-b border-dashed border-gray-200 pb-6 mb-6">
              <div className="flex justify-between text-textSec">
                <span>Tạm tính</span>
                <span className="text-textMain font-bold">{total.toLocaleString("vi-VN")}đ</span>
              </div>
              <div className="flex justify-between text-textSec">
                <span>Phí giao hàng</span>
                <span className="text-textMain font-bold">
                  {deliveryFee > 0 ? `${deliveryFee.toLocaleString("vi-VN")}đ` : "Miễn phí"}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-8">
              <span className="text-lg font-extrabold uppercase tracking-wider">Tổng cộng</span>
              <span className="text-3xl font-black text-primary">
                {finalTotal.toLocaleString("vi-VN")}đ
              </span>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing || (deliveryOption === "delivery" && (!address || !phone))}
              className="w-full bg-primary hover:bg-primaryDark disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <CheckCircle2 size={20} />
                  Đặt hàng
                </>
              )}
            </button>

            {deliveryOption === "delivery" && (!address || !phone) && (
              <p className="text-xs text-red-500 mt-2 text-center">
                Vui lòng nhập đầy đủ thông tin giao hàng
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

