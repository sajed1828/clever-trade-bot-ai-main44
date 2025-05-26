import streamlit as st
import ccxt

st.set_page_config(page_title="محفظتي الذكية", layout="wide")

st.title("📊 محفظة التداول الذكية")

# إدخال API Key و Secret
api_key = st.text_input("🔑 أدخل Binance API Key", type="password")
api_secret = st.text_input("🛡️ أدخل Binance API Secret", type="password")

if api_key and api_secret:
    try:
        binance = ccxt.binance({
            'apiKey': api_key,
            'secret': api_secret,
            'enableRateLimit': True
        })

        balance = binance.fetch_balance()
        st.success("✅ تم الاتصال بـ Binance بنجاح!")

        st.subheader("📦 العملات التي تمتلكها:")
        data = []

        for coin, amount in balance['total'].items():
            if amount > 0:
                data.append((coin, amount))

        if data:
            st.table(data)
        else:
            st.warning("🚫 لا يوجد رصيد ظاهر حاليًا.")

    except Exception as e:
        st.error(f"❌ حدث خطأ أثناء الاتصال: {str(e)}")
else:
    st.info("👆 أدخل مفاتيح API لعرض محفظتك.")

