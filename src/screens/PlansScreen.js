import React, { useEffect, useState } from 'react'
import db from '../firebase'
import './PlansScreen.css'
import {useSelector} from 'react-redux'
import {selectUser} from '../features/userSlice'
import { loadStripe } from '@stripe/stripe-js'
function PlansScreen() {
    const [products, setProducts] = useState([])
    const user = useSelector(selectUser)
    const [subscription, setSubscription] = useState(null);

    useEffect(() => {
        db.collection('customers')
        .doc(user.uid)
        .collection('subscriptions')
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach(async (subscription) => {
                setSubscription({
                    role: subscription.data().role,
                    current_period_end: subscription.data().current_period_end.seconds,
                    current_period_start: subscription.data().current_period_start.seconds,

                })
            })
        })
    }, [user.uid])

    useEffect(() => {
        db.collection('products')
        .where('active','==',true)
        .get()
        .then((querySnapshot) => {
            const products = {};
            querySnapshot.forEach(async (productDoc) => {
                products[productDoc.id] = productDoc.data();
                const priceSnap = await productDoc.ref.collection('prices').get();
                priceSnap.docs.forEach((price) => {
                    products[productDoc.id].prices = {
                        priceId: price.id,
                        priceData: price.data()
                    } 
                })
            })
            setProducts(products);
            })
    }, [])
    console.log(subscription)
    console.log(products)

    const loadCheckout = async (priceId) => {
        const docRef = await db
            .collection('customers')
            .doc(user.uid)
            .collection("checkout_sessions")
            .add({
                price: priceId,
                success_url: window.location.origin,
                cancel_url: window.location.origin,
            });
        
        docRef.onSnapshot(async (snap) => {
            const { error, sessionId } = snap.data();
            if  (error) {
                alert(`An error occured: ${error.message}`)
            }
            if (sessionId) {
                const stripe = await loadStripe('pk_test_51I3o7xEQUUQllSxzFfjGSMxpFhRrraTxW7LYI6nEmstqAOaMLFbxgsfQwkmjX7YtL7f9neZEkkYSYwWWK1jh462N00ydLBZMFn')
                stripe.redirectToCheckout({ sessionId });
            }
        })

    }

    return (
        <div className="plansScreen">
            {subscription && <p>Subscription Renewal Date: {new Date(subscription?.current_period_end * 1000).toLocaleDateString()}</p>}
            {Object.entries(products).map(([productId, productData]) => {
                 
                 const isCurrentPackage = productData.name?.toLowerCase().includes(subscription?.role)
                    console.log(subscription?.role)
                    console.log(productData.name)
                    console.log(isCurrentPackage)
                    return (
                        <div key={productId} className={`${isCurrentPackage && "planScreen__plan--disabled"} planScreen__plan`}>
                            <div className="planScreen__info">
                                <h3>{productData.name}</h3>
                                <p>{productData.description}</p>
                            </div>

                            <button onClick={() => !isCurrentPackage && loadCheckout(productData.prices.priceId)}>
                                {isCurrentPackage ? "Current Plan" : "Subscribe"}
                            </button>
                        </div>
                    );
            })}
            
        </div>
    )
}

export default PlansScreen
