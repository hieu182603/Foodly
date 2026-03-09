import React, { useState } from "react";
import {
  ArrowLeft,
  ClipboardList,
  MapPin,
  Phone,
  CreditCard,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Truck,
  ShoppingBag,
  Bell,
  DollarSign,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CartItem, User, Order } from "../types";
import { dbService } from "../databaseService";

interface CheckoutPageProps {
  cart: CartItem[];
  currentUser: User | null;
  onCheckoutSuccess?: () => void;
}

const CheckoutPage = ({
  cart,
  currentUser,
  onCheckoutSuccess,
}: CheckoutPageProps) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState<"takeaway" | "delivery">(
    "delivery"
  );
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");

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
    const orderId = `ORD-${Date.now()}`;
    const newOrder: Order = {
      id: orderId,
      userId: currentUser.id,
      customer: currentUser.name,
      items: cart,
      address: deliveryOption === "delivery" ? address : "Tại cửa hàng",
      phone: phone || "N/A",
      paymentMethod,
      deliveryOption,
      total: finalTotal,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    try {
      await dbService.addOrder(newOrder);

      // Clear cart
      if (onCheckoutSuccess) {
        onCheckoutSuccess();
      }

      // Success animation delay
      setTimeout(() => {
        setIsProcessing(false);
        navigate(`/orders/${orderId}`);
      }, 1500);
    } catch (error) {
      console.error("Failed to save order:", error);
      alert("Có lỗi xảy ra khi lưu đơn hàng. Vui lòng thử lại.");
      setIsProcessing(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-10 rounded-3xl shadow-2xl shadow-primary/10 text-center max-w-md w-full border border-gray-100 flex flex-col items-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <Bell className="text-primary w-10 h-10 animate-bounce" />
          </div>
          <h2 className="text-2xl font-black text-textMain mb-2">Yêu cầu đăng nhập</h2>
          <p className="text-textSec mb-8">Vui lòng đăng nhập để có thể tiếp tục quá trình đặt hàng và nhận ưu đãi.</p>
          <button
            onClick={() => navigate("/login")}
            className="w-full py-4 bg-primary text-white font-black rounded-2xl hover:bg-primaryDark transition-all shadow-lg shadow-primary/30"
          >
            ĐĂNG NHẬP NGAY
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Modern Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/cart")}
              className="p-3 bg-white hover:bg-gray-50 text-gray-400 hover:text-primary rounded-2xl shadow-sm border border-gray-100 transition-all group"
            >
              <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <h1 className="text-4xl font-black text-textMain tracking-tight">Thanh toán</h1>
              <p className="text-textSec font-medium">Hoàn tất đơn hàng của bạn</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-2xl border border-green-100">
            <ShieldCheck className="text-green-500" size={20} />
            <span className="text-green-700 text-sm font-bold">Thanh toán an toàn 100%</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Details */}
          <div className="lg:col-span-8 space-y-8">

            {/* Delivery Section */}
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Truck className="text-primary" size={20} />
                </div>
                <h2 className="text-xl font-black text-textMain uppercase tracking-wider">Phương thức nhận hàng</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <button
                  onClick={() => setDeliveryOption("delivery")}
                  className={`relative p-6 rounded-22px border-2 transition-all flex flex-col gap-4 text-left ${deliveryOption === "delivery"
                    ? "border-primary bg-primary/5 ring-4 ring-primary/10"
                    : "border-gray-100 bg-gray-50/50 hover:border-primary/30"
                    }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${deliveryOption === 'delivery' ? 'border-primary' : 'border-gray-300'}`}>
                    {deliveryOption === 'delivery' && <div className="w-3 h-3 bg-primary rounded-full" />}
                  </div>
                  <div>
                    <div className="font-black text-textMain text-lg">Giao hàng tận nơi</div>
                    <div className="text-sm text-textSec font-medium mt-1">Chúng tôi giao đến tận cửa nhà bạn</div>
                  </div>
                  <div className="absolute top-6 right-6 font-black text-primary bg-white px-3 py-1 rounded-lg shadow-sm border border-gray-100">
                    +30.000đ
                  </div>
                </button>

                <button
                  onClick={() => setDeliveryOption("takeaway")}
                  className={`relative p-6 rounded-22px border-2 transition-all flex flex-col gap-4 text-left ${deliveryOption === "takeaway"
                    ? "border-primary bg-primary/5 ring-4 ring-primary/10"
                    : "border-gray-100 bg-gray-50/50 hover:border-primary/30"
                    }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${deliveryOption === 'takeaway' ? 'border-primary' : 'border-gray-300'}`}>
                    {deliveryOption === 'takeaway' && <div className="w-3 h-3 bg-primary rounded-full" />}
                  </div>
                  <div>
                    <div className="font-black text-textMain text-lg">Tự đến lấy món</div>
                    <div className="text-sm text-textSec font-medium mt-1">Bạn sẽ đến cửa hàng để nhận món</div>
                  </div>
                  <div className="absolute top-6 right-6 font-black text-green-500 bg-white px-3 py-1 rounded-lg shadow-sm border border-gray-100 text-xs">
                    MIỄN PHÍ
                  </div>
                </button>
              </div>

              <div className={`space-y-6 transition-all duration-300 ${deliveryOption === 'delivery' ? 'opacity-100 max-h-[500px]' : 'opacity-30 pointer-events-none'}`}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-black text-textMain uppercase tracking-widest ml-1">Số điện thoại liên hệ</label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="09xx xxx xxx"
                        disabled={deliveryOption === 'takeaway'}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-textMain"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-black text-textMain uppercase tracking-widest ml-1">Địa chỉ nhận hàng</label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Số nhà, tên đường, quận/huyện..."
                        disabled={deliveryOption === 'takeaway'}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-textMain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <CreditCard className="text-primary" size={20} />
                </div>
                <h2 className="text-xl font-black text-textMain uppercase tracking-wider">Hình thức thanh toán</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <button
                  onClick={() => setPaymentMethod("cash")}
                  className={`p-6 rounded-22px border-2 transition-all flex items-center gap-4 text-left ${paymentMethod === "cash"
                    ? "border-primary bg-primary/5 ring-4 ring-primary/10"
                    : "border-gray-100 bg-gray-50/50 hover:border-primary/30"
                    }`}
                >
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-primary">
                    <DollarSign size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="font-black text-textMain">Tiền mặt</div>
                    <div className="text-xs text-textSec font-bold">Thanh toán khi nhận món</div>
                  </div>
                  {paymentMethod === 'cash' && <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white"><CheckCircle2 size={14} /></div>}
                </button>

                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`p-6 rounded-22px border-2 transition-all flex items-center gap-4 text-left ${paymentMethod === "card"
                    ? "border-primary bg-primary/5 ring-4 ring-primary/10"
                    : "border-gray-100 bg-gray-50/50 hover:border-primary/30"
                    }`}
                >
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-primary">
                    <CreditCard size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="font-black text-textMain">Thẻ tín dụng</div>
                    <div className="text-xs text-textSec font-bold">Thanh toán qua ví/NH</div>
                  </div>
                  {paymentMethod === 'card' && <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white"><CheckCircle2 size={14} /></div>}
                </button>
              </div>
            </div>

            {/* Note Section */}
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <ClipboardList className="text-primary" size={20} />
                </div>
                <h2 className="text-xl font-black text-textMain uppercase tracking-wider">Ghi chú đơn hàng</h2>
              </div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ví dụ: Không hành, thêm cay, địa chỉ dễ tìm..."
                rows={3}
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-textMain resize-none"
              />
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4 sticky top-12">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-primary/5 border border-gray-100 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12" />

              <div className="relative mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingBag className="text-primary" size={20} />
                  <span className="font-black text-primary uppercase tracking-widest text-xs">Phân tích giá</span>
                </div>
                <h3 className="text-2xl font-black text-textMain tracking-tight">Tóm tắt đơn</h3>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center group">
                  <span className="text-textSec font-bold group-hover:text-textMain transition-colors">Tạm tính ({cart.length} món)</span>
                  <span className="text-textMain font-black tracking-tight">{total.toLocaleString("vi-VN")}đ</span>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="text-textSec font-bold group-hover:text-textMain transition-colors">Phí giao hàng</span>
                  <span className={`font-black tracking-tight ${deliveryFee === 0 ? 'text-green-500' : 'text-textMain'}`}>
                    {deliveryFee > 0 ? `${deliveryFee.toLocaleString("vi-VN")}đ` : "MIỄN PHÍ"}
                  </span>
                </div>

                <div className="pt-6 mt-6 border-t-4 border-gray-50 border-dashed">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-textSec font-black uppercase text-[10px] tracking-[0.2em]">Tổng cộng thanh toán</span>
                      <div className="text-3xl font-black text-primary tracking-tighter mt-1">{finalTotal.toLocaleString("vi-VN")}đ</div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing || (deliveryOption === "delivery" && (!address || !phone))}
                className="w-full relative group bg-primary hover:bg-primaryDark disabled:bg-gray-200 disabled:cursor-not-allowed py-5 rounded-2xl shadow-xl shadow-primary/30 transition-all active:scale-95 overflow-hidden"
              >
                <div className="relative z-10 flex items-center justify-center gap-3">
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-4 border-white border-t-transparent" />
                      <span className="text-white font-black uppercase tracking-widest text-sm">Đang bảo mật...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-white font-black uppercase tracking-widest text-sm">Xác nhận thanh toán</span>
                      <ChevronRight className="text-white group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>

              {deliveryOption === "delivery" && (!address || !phone) && (
                <div className="mt-4 flex items-center gap-2 justify-center bg-red-50 p-3 rounded-xl border border-red-100 animate-pulse">
                  <Bell className="text-red-500" size={14} />
                  <p className="text-[11px] text-red-600 font-bold uppercase tracking-tight">
                    Vui lòng nhập thông tin liên lạc
                  </p>
                </div>
              )}

              <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-center gap-4 opacity-40 grayscale">
                {/* Trusted payment icons placeholder */}
                <div className="w-8 h-4 bg-gray-300 rounded" />
                <div className="w-8 h-4 bg-gray-300 rounded" />
                <div className="w-8 h-4 bg-gray-300 rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60">
          <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl bg-white/40">
            <Truck className="text-primary" size={20} />
            <span className="text-xs font-bold text-textMain">Giao hàng siêu tốc 30p</span>
          </div>
          <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl bg-white/40">
            <ShieldCheck className="text-primary" size={20} />
            <span className="text-xs font-bold text-textMain">Bảo mật thông tin khách hàng</span>
          </div>
          <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl bg-white/40">
            <ShoppingBag className="text-primary" size={20} />
            <span className="text-xs font-bold text-textMain">Hoàn trả nếu món không đạt chuẩn</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
